package in.accessmap.model;

import java.time.Instant;

public record AccessibilityReport(
        String id,
        String placeId,
        String feature,
        String status,
        String notes,
        String reporterName,
        Instant createdAt
) {}
