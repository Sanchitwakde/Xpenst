package com.sanz.xpensto.repository;

import com.sanz.xpensto.model.ExpenseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;

@Repository
public interface ExpenseRepo extends JpaRepository<ExpenseModel, Long> {

    List<ExpenseModel> findByUserId(Long id);
    List<ExpenseModel> findByUserIdOrderByDateDesc(Long userId);
    List<ExpenseModel> findByUserIdAndCategoryIgnoreCase(Long userId, String category);
    List<ExpenseModel> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
// extending jpa repo so it tells spring that entity class - ExpenseModel
// and primary key is type - Long
// this avoids manual DAO methods, DB connection and manual CRUD boilerplate
