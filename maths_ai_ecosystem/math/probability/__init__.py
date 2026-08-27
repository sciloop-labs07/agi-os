def bayes_update(prior: float, likelihood: float, evidence: float) -> float:
    """Bayesian belief update with safe numeric bounds."""
    if evidence <= 0:
        return prior
    return max(0.0, min(1.0, prior * likelihood / evidence))


def confidence_mean(values: list[float]) -> float:
    return sum(values) / max(1, len(values))
