package in.accessmap.model;

import java.util.List;

public record Place(
        String id,
        String name,
        String address,
        String category,
        double latitude,
        double longitude,
        List<AccessibilityItem> accessibility
) {}
