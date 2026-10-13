package in.accessmap.controller;

import in.accessmap.model.AccessibilityReport;
import in.accessmap.model.Place;
import in.accessmap.model.ReportRequest;
import in.accessmap.service.AccessMapService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PlacesController {
    private final AccessMapService service;

    public PlacesController(AccessMapService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public HealthResponse health() {
        return new HealthResponse("ok", "AccessMap API is running");
    }

    @GetMapping("/places")
    public List<Place> getPlaces() {
        return service.getPlaces();
    }

    @GetMapping("/places/{id}")
    public Place getPlace(@PathVariable String id) {
        Place place = service.getPlace(id);
        if (place == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found");
        return place;
    }

    @GetMapping("/places/{id}/reports")
    public List<AccessibilityReport> getReports(@PathVariable String id) {
        List<AccessibilityReport> reports = service.getReports(id);
        if (reports == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found");
        return reports;
    }

    @PostMapping("/places/{id}/reports")
    @ResponseStatus(HttpStatus.CREATED)
    public AccessibilityReport addReport(@PathVariable String id, @Valid @RequestBody ReportRequest request) {
        try {
            AccessibilityReport report = service.addReport(id, request);
            if (report == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found");
            return report;
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
        }
    }

    public record HealthResponse(String status, String message) {}
}
