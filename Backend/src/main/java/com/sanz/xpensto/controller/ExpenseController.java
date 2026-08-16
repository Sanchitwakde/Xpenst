package com.sanz.xpensto.controller;

import com.sanz.xpensto.model.ExpenseModel;
import com.sanz.xpensto.dto.ExpenseRequest;
import com.sanz.xpensto.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping
    public ExpenseModel addExpense(@RequestBody ExpenseRequest request){
        return expenseService.addExpense(request);
    }
    @GetMapping
    public List<ExpenseModel> getAllExpense(){

        return expenseService.getAllExpenses();
    }

    @GetMapping("/{id}")
    public ExpenseModel getExpenseById(@PathVariable Long id){
        return expenseService.getExpensebyId(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: "+id));
    }

    @PutMapping("/{id}")
    public ExpenseModel updateExpense(@PathVariable Long id,@RequestBody ExpenseRequest request){
        return expenseService.updateExpense(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteExpenseById(@PathVariable Long id){
        expenseService.deleteExpense(id);
    }






}
