import 'dart:convert';
import 'package:http/http.dart' as http;

/// Service to monitor API credits/balances for all LLM providers
class ProviderBalanceService {
  
  // Provider configurations
  static const Map<String, ProviderConfig> providers = {
    'anthropic': ProviderConfig(
      name: 'Anthropic (Claude)',
      checkUrl: 'https://api.anthropic.com/v1/account',
      headers: {'x-api-key': 'ANTHROPIC_API_KEY'},
      balanceExtractor: _extractAnthropicBalance,
    ),
    'openai': ProviderConfig(
      name: 'OpenAI (GPT)',
      checkUrl: 'https://api.openai.com/v1/dashboard/billing/credit_grants',
      headers: {'Authorization': 'Bearer OPENAI_API_KEY'},
      balanceExtractor: _extractOpenAIBalance,
    ),
    'gemini': ProviderConfig(
      name: 'Google (Gemini)',
      checkUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      headers: {'x-goog-api-key': 'GEMINI_API_KEY'},
      balanceExtractor: _extractGeminiBalance,
    ),
    'zhipu': ProviderConfig(
      name: 'Zhipu (GLM-5)',
      checkUrl: 'https://open.bigmodel.cn/api/paas/v4/user/info',
      headers: {'Authorization': 'ZHIPU_API_KEY'},
      balanceExtractor: _extractZhipuBalance,
    ),
    'moonshot': ProviderConfig(
      name: 'Moonshot (Kimi)',
      checkUrl: 'https://api.moonshot.cn/v1/users/me/balance',
      headers: {'Authorization': 'Bearer MOONSHOT_API_KEY'},
      balanceExtractor: _extractMoonshotBalance,
    ),
  };

  /// Check all provider balances
  static Future<List<ProviderBalance>> checkAllBalances() async {
    List<ProviderBalance> balances = [];
    
    for (var entry in providers.entries) {
      try {
        final balance = await _checkProvider(entry.key, entry.value);
        balances.add(balance);
      } catch (e) {
        balances.add(ProviderBalance(
          providerId: entry.key,
          providerName: entry.value.name,
          balance: 0.0,
          currency: 'USD',
          status: 'error',
          errorMessage: e.toString(),
          lastUpdated: DateTime.now(),
        ));
      }
    }
    
    return balances;
  }

  /// Check single provider balance
  static Future<ProviderBalance> _checkProvider(
    String providerId,
    ProviderConfig config,
  ) async {
    // Get API key from secure storage
    final apiKey = await _getApiKey(providerId);
    if (apiKey == null || apiKey.isEmpty) {
      return ProviderBalance(
        providerId: providerId,
        providerName: config.name,
        balance: 0.0,
        currency: 'USD',
        status: 'no_key',
        errorMessage: 'API key not configured',
        lastUpdated: DateTime.now(),
      );
    }

    // Make request
    final headers = Map<String, String>.from(config.headers);
    headers.forEach((key, value) {
      if (value.contains('API_KEY')) {
        headers[key] = apiKey;
      }
    });

    final response = await http.get(
      Uri.parse(config.checkUrl),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return config.balanceExtractor(providerId, config.name, data);
    } else {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
  }

  // Balance extractors for each provider
  
  static ProviderBalance _extractAnthropicBalance(
    String id,
    String name,
    Map<String, dynamic> data,
  ) {
    // Anthropic doesn't expose balance directly via API
    // This would need to be scraped from dashboard or use billing API
    return ProviderBalance(
      providerId: id,
      providerName: name,
      balance: data['balance']?.toDouble() ?? 0.0,
      currency: 'USD',
      status: 'active',
      lastUpdated: DateTime.now(),
    );
  }

  static ProviderBalance _extractOpenAIBalance(
    String id,
    String name,
    Map<String, dynamic> data,
  ) {
    final grants = data['grants'] as Map<String, dynamic>?;
    final totalAvailable = grants?['total_available']?.toDouble() ?? 0.0;
    
    return ProviderBalance(
      providerId: id,
      providerName: name,
      balance: totalAvailable,
      currency: 'USD',
      status: totalAvailable > 0 ? 'active' : 'depleted',
      lastUpdated: DateTime.now(),
    );
  }

  static ProviderBalance _extractGeminiBalance(
    String id,
    String name,
    Map<String, dynamic> data,
  ) {
    // Gemini uses Google Cloud billing - complex to get real-time
    // Return mock for now
    return ProviderBalance(
      providerId: id,
      providerName: name,
      balance: 0.0, // Would need Google Cloud Billing API
      currency: 'USD',
      status: 'unknown',
      errorMessage: 'Requires Google Cloud Billing API access',
      lastUpdated: DateTime.now(),
    );
  }

  static ProviderBalance _extractZhipuBalance(
    String id,
    String name,
    Map<String, dynamic> data,
  ) {
    // Zhipu balance in CNY
    final balance = data['data']?['balance']?.toDouble() ?? 0.0;
    
    return ProviderBalance(
      providerId: id,
      providerName: name,
      balance: balance,
      currency: 'CNY',
      status: balance > 0 ? 'active' : 'depleted',
      lastUpdated: DateTime.now(),
    );
  }

  static ProviderBalance _extractMoonshotBalance(
    String id,
    String name,
    Map<String, dynamic> data,
  ) {
    // Moonshot in CNY
    final balance = data['data']?['available_balance']?.toDouble() ?? 0.0;
    
    return ProviderBalance(
      providerId: id,
      providerName: name,
      balance: balance,
      currency: 'CNY',
      status: balance > 0 ? 'active' : 'depleted',
      lastUpdated: DateTime.now(),
    );
  }

  static Future<String?> _getApiKey(String providerId) async {
    // TODO: Implement secure storage retrieval
    // For now, return from environment or config
    return null;
  }

  /// Get total balance across all providers
  static double getTotalBalance(List<ProviderBalance> balances) {
    // Note: This mixes currencies, just for reference
    return balances.fold(0.0, (sum, b) => sum + b.balance);
  }

  /// Get providers needing recharge
  static List<ProviderBalance> getLowBalanceProviders(
    List<ProviderBalance> balances, {
    double threshold = 5.0,
  }) {
    return balances.where((b) {
      return b.status == 'active' && b.balance < threshold;
    }).toList();
  }
}

/// Provider configuration
class ProviderConfig {
  final String name;
  final String checkUrl;
  final Map<String, String> headers;
  final BalanceExtractor balanceExtractor;

  const ProviderConfig({
    required this.name,
    required this.checkUrl,
    required this.headers,
    required this.balanceExtractor,
  });
}

/// Balance data model
typedef BalanceExtractor = ProviderBalance Function(
  String providerId,
  String providerName,
  Map<String, dynamic> data,
);

class ProviderBalance {
  final String providerId;
  final String providerName;
  final double balance;
  final String currency;
  final String status; // active, depleted, error, no_key, unknown
  final String? errorMessage;
  final DateTime lastUpdated;

  ProviderBalance({
    required this.providerId,
    required this.providerName,
    required this.balance,
    required this.currency,
    required this.status,
    this.errorMessage,
    required this.lastUpdated,
  });

  bool get isActive => status == 'active';
  bool get isLow => balance < 5.0 && isActive;
  bool get needsAttention => status != 'active' || isLow;

  String get formattedBalance {
    if (currency == 'CNY') {
      return '¥${balance.toStringAsFixed(2)}';
    }
    return '\$${balance.toStringAsFixed(2)}';
  }

  String get statusEmoji {
    switch (status) {
      case 'active':
        return isLow ? '⚠️' : '✅';
      case 'depleted':
        return '❌';
      case 'error':
        return '🔴';
      case 'no_key':
        return '⚪';
      default:
        return '❓';
    }
  }

  String get statusText {
    if (status == 'active' && isLow) return 'Low Balance';
    switch (status) {
      case 'active':
        return 'Active';
      case 'depleted':
        return 'Depleted';
      case 'error':
        return 'Error';
      case 'no_key':
        return 'Not Configured';
      default:
        return 'Unknown';
    }
  }
}
