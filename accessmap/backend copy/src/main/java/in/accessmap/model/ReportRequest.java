package in.accessmap.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReportRequest(
        @NotBlank String feature,
        @NotBlank String status,
        @Size(max = 500) String notes,
        @Size(max = 80) String reporterName
) {}
