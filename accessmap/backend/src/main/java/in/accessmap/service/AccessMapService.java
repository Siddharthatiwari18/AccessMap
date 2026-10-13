package in.accessmap.service;

import in.accessmap.model.AccessibilityItem;
import in.accessmap.model.AccessibilityReport;
import in.accessmap.model.Place;
import in.accessmap.model.ReportRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AccessMapService {
    private final Map<String, Place> places = new ConcurrentHashMap<>();
    private final Map<String, List<AccessibilityReport>> reports = new ConcurrentHashMap<>();

    public AccessMapService() {
        addPlace(new Place("place-1", "Green Leaf Community Cafe", "Connaught Place, New Delhi", "Cafe",
                28.6315, 77.2167, List.of(
                new AccessibilityItem("RAMP", "YES", "A community member reported a ramp; current condition not independently verified."),
                new AccessibilityItem("STEP_FREE", "UNKNOWN", "No confirmed report available."),
                new AccessibilityItem("ACCESSIBLE_TOILET", "UNKNOWN", "No confirmed report available."))));
        addPlace(new Place("place-2", "Central City Library", "Mandi House, New Delhi", "Library",
                28.6258, 77.2345, List.of(
                new AccessibilityItem("RAMP", "UNKNOWN", "No confirmed report available."),
                new AccessibilityItem("STEP_FREE", "YES", "Reported by a community member; call ahead to confirm."),
                new AccessibilityItem("ACCESSIBLE_TOILET", "LIMITED", "Details are incomplete."))));
        addPlace(new Place("place-3", "Lotus Health Centre", "Lajpat Nagar, New Delhi", "Healthcare",
                28.5677, 77.2433, List.of(
                new AccessibilityItem("RAMP", "YES", "Community-reported ramp."),
                new AccessibilityItem("PARKING", "NO", "One report said accessible parking was not identified."),
                new AccessibilityItem("ACCESSIBLE_TOILET", "UNKNOWN", "No confirmed report available."))));
        addPlace(new Place("place-4", "Riverside Arts Hall", "Mayur Vihar, New Delhi", "Community venue",
                28.6088, 77.2944, List.of(
                new AccessibilityItem("RAMP", "LIMITED", "Reported as steep; suitability varies by mobility needs."),
                new AccessibilityItem("STEP_FREE", "NO", "One report described steps at the main entrance."),
                new AccessibilityItem("ACCESSIBLE_TOILET", "UNKNOWN", "No confirmed report available."))));
    }

    private void addPlace(Place place) {
        places.put(place.id(), place);
        reports.put(place.id(), new ArrayList<>());
    }

    public List<Place> getPlaces() {
        return places.values().stream().sorted(Comparator.comparing(Place::name)).toList();
    }

    public Place getPlace(String id) {
        return places.get(id);
    }

    public List<AccessibilityReport> getReports(String placeId) {
        List<AccessibilityReport> list = reports.get(placeId);
        if (list == null) return null;
        synchronized (list) {
            return List.copyOf(list);
        }
    }

    public AccessibilityReport addReport(String placeId, ReportRequest request) {
        List<AccessibilityReport> list = reports.get(placeId);
        if (list == null) return null;
        String feature = request.feature().trim().toUpperCase();
        String status = request.status().trim().toUpperCase();
        if (!List.of("RAMP", "STEP_FREE", "ACCESSIBLE_TOILET", "PARKING", "DOOR_WIDTH").contains(feature)) {
            throw new IllegalArgumentException("Unsupported feature.");
        }
        if (!List.of("YES", "NO", "LIMITED", "UNKNOWN").contains(status)) {
            throw new IllegalArgumentException("Unsupported status.");
        }
        AccessibilityReport report = new AccessibilityReport(
                UUID.randomUUID().toString(), placeId, feature, status,
                request.notes() == null ? "" : request.notes().trim(),
                request.reporterName() == null || request.reporterName().isBlank() ? "Community member" : request.reporterName().trim(),
                Instant.now());
        synchronized (list) {
            list.add(report);
        }
        return report;
    }

    public String answerQuestion(String question) {
        String q = question.toLowerCase();
        if (q.contains("ramp")) {
            List<String> names = getPlaces().stream()
                    .filter(p -> p.accessibility().stream().anyMatch(a -> a.feature().equals("RAMP") && a.status().equals("YES")))
                    .map(Place::name).toList();
            if (names.isEmpty()) return "I don't have a confirmed community report for a ramp in the current sample data. Unknown information does not mean a place is inaccessible.";
            return "The current sample data has a community-reported ramp at: " + String.join(", ", names)
                    + ". These reports are not independently verified; please contact the venue to confirm the current entrance and ramp condition.";
        }
        if (q.contains("toilet") || q.contains("restroom") || q.contains("washroom")) {
            return "The sample data has incomplete accessible-toilet information. The Central City Library is marked LIMITED, and the other listed venues are UNKNOWN. Please contact a venue directly before travelling.";
        }
        if (q.contains("step") || q.contains("entrance") || q.contains("step-free")) {
            return "The sample data reports step-free entry at Central City Library and steps at Riverside Arts Hall's main entrance. Reports may be outdated, so confirm with the venue and ask about an alternate entrance.";
        }
        return "I can only answer from the current sample accessibility reports. Try asking about ramps, step-free entry, or accessible toilets. Missing information is shown as unknown—not as proof that a place is inaccessible.";
    }
}
