package in.accessmap.controller;

import in.accessmap.model.AskRequest;
import in.accessmap.model.AskResponse;
import in.accessmap.service.AccessMapService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AssistantController {
    private final AccessMapService service;

    public AssistantController(AccessMapService service) {
        this.service = service;
    }

    @PostMapping("/ask")
    public AskResponse ask(@Valid @RequestBody AskRequest request) {
        // Evidence-grounded demo logic. No external AI API key is required.
        return new AskResponse(service.answerQuestion(request.question().trim()), "demo-grounded");
    }
}
