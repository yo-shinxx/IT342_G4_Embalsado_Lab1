package com.quantix.backend.listener;

import com.quantix.backend.event.UserLoginEvent;
import com.quantix.backend.event.UserRegisterEvent;
import com.quantix.backend.service.TransactionLoggerService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TransactionHistoryListener {

    private final TransactionLoggerService transactionLogger;

    @EventListener
    public void onUserRegister(UserRegisterEvent event) {
        transactionLogger.log(
                "REGISTER",
                event.getUserId(),
                event.getEmail(),
                "User registered: " + event.getFirstName() + " " + event.getLastName()
        );
    }

    @EventListener
    public void onUserLogin(UserLoginEvent event) {
        transactionLogger.log(
                "LOGIN",
                event.getUserId(),
                event.getEmail(),
                "User logged in via " + event.getLoginMethod()
        );
    }
}