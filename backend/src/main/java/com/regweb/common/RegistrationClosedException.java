package com.regweb.common;

public class RegistrationClosedException extends RuntimeException {
    public RegistrationClosedException(String message) {
        super(message);
    }
}
