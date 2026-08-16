package com.sanz.xpensto.service;

import com.sanz.xpensto.model.UserModel;
import com.sanz.xpensto.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepo userRepo;

    public UserModel createUser(UserModel user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists with email: " + user.getEmail());
        }
        return userRepo.save(user);
    }

    public List<UserModel> getAllUsers() {
        return userRepo.findAll();
    }

    public Optional<UserModel> getUserById(Long id) {
        return userRepo.findById(id);
    }

    public UserModel updateUser(Long id, UserModel updatedUser) {
        UserModel user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (userRepo.existsByEmailAndIdNot(updatedUser.getEmail(), id)) {
            throw new RuntimeException("Another user already exists with email: " + updatedUser.getEmail());
        }

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            user.setPassword(updatedUser.getPassword());
        }

        if (updatedUser.getRole() != null && !updatedUser.getRole().isBlank()) {
            user.setRole(updatedUser.getRole());
        }

        return userRepo.save(user);
    }

    public void deleteUser(Long id) {
        if(!userRepo.existsById(id)){
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepo.deleteById(id);
    }
}
