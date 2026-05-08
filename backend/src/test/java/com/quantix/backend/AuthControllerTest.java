package com.quantix.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quantix.backend.auth.dto.LoginRequest;
import com.quantix.backend.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void registerValidUser_ShouldReturn201AndToken() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("testt.student@cit.edu");
        request.setPassword("secret85765");
        request.setFirstName("Test");
        request.setLastName("Student");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.email").value("testt.student@cit.edu"));
    }

    @Test
    void registerWithInvalidEmailDomain_ShouldReturn400() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("wrong@gmailcom");
        request.setPassword("Secret123");
        request.setFirstName("Wrong");
        request.setLastName("Email");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginValidCredentials_ShouldReturn200AndToken() throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail("coordinator@cit.edu");
        login.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }

    @Test
    void loginInvalidPassword_ShouldReturn401() throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail("coordinator@cit.edu");
        login.setPassword("wrong");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }
}