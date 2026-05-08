package com.quantix.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantix.backend.equipment.dto.EquipmentRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class EquipmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String coordinatorToken;
    private String nasToken;
    private Long testEquipmentId;

    private String loginAndGetToken(String email, String password) throws Exception {
        Map<String, String> loginRequest = Map.of("email", email, "password", password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        JsonNode node = objectMapper.readTree(response);
        String token = node.path("data").path("token").asText();
        if (token.isEmpty()) {
            token = node.path("token").asText();
        }
        return token;
    }

    private Long createTestEquipment(String token) throws Exception {
        EquipmentRequest request = new EquipmentRequest();
        request.setName("Test Oscilloscope");
        request.setCategoryId(1L);
        request.setConditionStatus("GOOD");
        request.setQuantity(5);

        MvcResult result = mockMvc.perform(post("/api/equipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        JsonNode node = objectMapper.readTree(response);
        return node.path("data").path("id").asLong();
    }

    @BeforeEach
    void setUp() throws Exception {
        coordinatorToken = loginAndGetToken("coordinator@cit.edu", "password123");
        nasToken = loginAndGetToken("nas@cit.edu", "password123");
        testEquipmentId = createTestEquipment(coordinatorToken);
    }

    @Test
    void getAllEquipment_ShouldReturn200AndPaginatedResponse() throws Exception {
        mockMvc.perform(get("/api/equipments")
                        .param("page", "0")
                        .param("limit", "10")
                        .header("Authorization", "Bearer " + coordinatorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }

    @Test
    void getEquipmentById_ExistingId_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/equipments/{id}", testEquipmentId)
                        .header("Authorization", "Bearer " + coordinatorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(testEquipmentId));
    }

    @Test
    void createEquipment_AsCoordinator_ShouldReturn201() throws Exception {
        EquipmentRequest request = new EquipmentRequest();
        request.setName("Test Oscilloscope");
        request.setCategoryId(1L);
        request.setConditionStatus("GOOD");
        request.setQuantity(5);

        mockMvc.perform(post("/api/equipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("Authorization", "Bearer " + coordinatorToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Test Oscilloscope"));
    }

    @Test
    void createEquipment_AsNas_ShouldReturn403() throws Exception {
        EquipmentRequest request = new EquipmentRequest();
        request.setName("Forbidden Item");
        request.setCategoryId(1L);
        request.setConditionStatus("GOOD");
        request.setQuantity(1);

        mockMvc.perform(post("/api/equipments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("Authorization", "Bearer " + nasToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateEquipmentStatus_AnyAuthenticatedUser_ShouldReturn200() throws Exception {
        String requestBody = "{\"status\":\"FAIR\"}";
        mockMvc.perform(put("/api/equipments/{id}/status", testEquipmentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
                        .header("Authorization", "Bearer " + nasToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.conditionStatus").value("FAIR"));
    }

    @Test
    void searchEquipment_ByKeyword_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/equipments/search")
                        .param("q", "oscilloscope")
                        .header("Authorization", "Bearer " + coordinatorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray());
    }
}