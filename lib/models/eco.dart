class Eco {
  final double co2Saved;
  final double waterSaved;

  const Eco({
    required this.co2Saved,
    required this.waterSaved,
  });

  factory Eco.fromJson(Map<String, dynamic> json) {
    return Eco(
      co2Saved: (json['co2Saved'] as num).toDouble(),
      waterSaved: (json['waterSaved'] as num).toDouble(),
    );
  }
}