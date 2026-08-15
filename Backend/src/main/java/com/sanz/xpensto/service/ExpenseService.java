package com.sanz.xpensto.service;

import com.sanz.xpensto.model.ExpenseModel;
import com.sanz.xpensto.model.UserModel;
import com.sanz.xpensto.repository.ExpenseRepo;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class ExpenseService {
        private final ExpenseRepo expenseRepository;
        public ExpenseService(ExpenseRepo expenseRepository){
            this.expenseRepository = expenseRepository;
        }
        public ExpenseModel addExpense(ExpenseModel expense){
            return expenseRepository.save(expense);
        }
        public List<ExpenseModel> getAllExpenses(){
            return expenseRepository.findAll();
        }
        public Optional<ExpenseModel> getExpensebyId(Long id){
            return expenseRepository.findById(id);
        }
        public ExpenseModel updateExpense(Long id, ExpenseModel updatedExpense) {
            return expenseRepository.findById(id)
                .map(expense -> {
                expense.setAmount(updatedExpense.getAmount());
                expense.setItem(updatedExpense.getItem());
                expense.setCategory(updatedExpense.getCategory());
                expense.setDate(updatedExpense.getDate());
                expense.setCreatedAt(updatedExpense.getCreatedAt());
                return expenseRepository.save(expense);
            }).orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
        }
        public void deleteExpense(Long id){
            expenseRepository.deleteById(id);
        }
    }







