package com.sanz.xpensto.service;

import com.sanz.xpensto.model.ExpenseModel;
import com.sanz.xpensto.model.UserModel;
import com.sanz.xpensto.dto.ExpenseRequest;
import com.sanz.xpensto.repository.ExpenseRepo;
import com.sanz.xpensto.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class ExpenseService {
        private final ExpenseRepo expenseRepository;
        private final UserRepo userRepo;

        public ExpenseService(ExpenseRepo expenseRepository, UserRepo userRepo){
            this.expenseRepository = expenseRepository;
            this.userRepo = userRepo;
        }

        public ExpenseModel addExpense(ExpenseRequest request){
            UserModel user = userRepo.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found" + request.getUserId()));
            ExpenseModel expense = new ExpenseModel();
            expense.setAmount(request.getAmount());
            expense.setCategory(request.getCategory());
            expense.setItem(request.getItem());
            expense.setDate(request.getDate());
            expense.setUser(user);

            return expenseRepository.save(expense);
        }
        public List<ExpenseModel> getAllExpenses(){
            return expenseRepository.findAll();
        }
        public List<ExpenseModel> getExpenseByUserId(Long uid){
            return expenseRepository.findByUserIdOrderByDateDesc(uid);
        }
        public Optional<ExpenseModel> getExpensebyId(Long id){
            return expenseRepository.findById(id);
        }

        public ExpenseModel updateExpense(Long id, ExpenseRequest request) {
            ExpenseModel expense = expenseRepository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Expense not found"+ id));
            UserModel user = userRepo.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

                expense.setAmount(request.getAmount());
                expense.setItem(request.getItem());
                expense.setCategory(request.getCategory());
                expense.setDate(request.getDate());

                return expenseRepository.save(expense);
            }
        public void deleteExpense(Long id){
            if(!expenseRepository.existsById(id)){
                throw new RuntimeException("Expense not found with id:" +id);
            }
            expenseRepository.deleteById(id);
        }
    }







