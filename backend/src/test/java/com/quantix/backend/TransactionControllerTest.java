package com.quantix.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String validToken;

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

    @BeforeEach
    void setUp() throws Exception {
        validToken = loginAndGetToken("coordinator@cit.edu", "password123");
    }

    @Test
    void getAllTransactions_ShouldReturn200AndPaginated() throws Exception {
        mockMvc.perform(get("/api/transaction-logs")
                        .param("page", "0")
                        .param("limit", "20")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void filterTransactionsByAction_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/transaction-logs")
                        .param("action", "EQUIPMENT_CREATED")
                        .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk());
    }
}