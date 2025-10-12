package com.todo.backend.controller;

import com.todo.backend.model.Todo;
import com.todo.backend.repository.TodoRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoRepository repository;

    public TodoController(TodoRepository repository) {
        this.repository = repository;
    }


    // Get all tasks 
@GetMapping
public List<Todo> getAllTodosDefault() {
    return repository.findAll();
}


    // Get tasks for today
    @GetMapping("/today")
    public List<Todo> getTodayTodos() {
        return repository.findByDate(LocalDate.now());
    }


    // Get overdue tasks

    @GetMapping("/overdue")
    public List<Todo> getOverdueTodos() {
        return repository.findByDateBefore(LocalDate.now());
    }


    // Get upcoming tasks
    @GetMapping("/upcoming")
    public List<Todo> getUpcomingTodos() {
        return repository.findByDateAfter(LocalDate.now());
    }

    // Add a new task with chosen date
    @PostMapping
    public Todo addTodo(@RequestBody Todo todo) {
        if (todo.getDate() == null) {
            todo.setDate(LocalDate.now());
        }
        todo.setCompleted(false);
        return repository.save(todo);
    }


    // Update task (title, date, completed status)

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        Todo existing = repository.findById(id).orElseThrow();
        existing.setTitle(todo.getTitle());
        existing.setDate(todo.getDate()); // allow date update
        existing.setCompleted(todo.isCompleted());
        return repository.save(existing);
    }

    // Delete task
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        repository.deleteById(id);
    }
}