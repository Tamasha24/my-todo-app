package com.todo.backend.repository;

import com.todo.backend.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    // Get tasks for a specific day
    List<Todo> findByDate(LocalDate date);

    // Get overdue tasks (date before the given date)
    List<Todo> findByDateBefore(LocalDate date);

    // Get upcoming tasks (date after the given date)
    List<Todo> findByDateAfter(LocalDate date);
}


