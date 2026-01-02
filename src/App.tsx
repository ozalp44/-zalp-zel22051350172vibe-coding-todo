import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return [
      {
        id: 1,
        text: "Friday Mehmet's class",
        completed: false,
      },
    ];
  });

  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
    setText("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: "40px auto", 
      fontFamily: "Arial, sans-serif", 
      padding: "0 15px" 
    }}>
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: "30px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          marginBottom: 30, 
          color: "#333",
          textAlign: "center",
          fontSize: "2.5em"
        }}>
          Todo List
        </h1>
        
        <div style={{ display: "flex", marginBottom: 30 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Enter new task..."
            style={{ 
              padding: "12px 16px", 
              flexGrow: 1,
              border: "2px solid #e0e0e0",
              borderRadius: 8,
              fontSize: 16,
              outline: "none",
              transition: "border-color 0.3s"
            }}
          />
          <button 
            onClick={addTodo} 
            style={{ 
              padding: "12px 24px", 
              marginLeft: 12, 
              background: "#667eea", 
              color: "white", 
              border: "none", 
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
              transition: "background 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#5568d3"}
            onMouseOut={(e) => e.currentTarget.style.background = "#667eea"}
          >
            Add
          </button>
        </div>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li 
              key={todo.id} 
              style={{ 
                marginBottom: 12, 
                display: "flex", 
                alignItems: "center",
                padding: "12px",
                background: todo.completed ? "#f5f5f5" : "white",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                transition: "all 0.3s"
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ 
                  transform: "scale(1.3)",
                  cursor: "pointer",
                  marginRight: 12
                }}
              />
              <span
                style={{
                  flexGrow: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#999" : "#333",
                  fontSize: 16
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ 
                  background: "#ef4444", 
                  color: "white", 
                  border: "none", 
                  padding: "8px 16px", 
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: "bold",
                  transition: "background 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
                onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p style={{ 
            textAlign: "center", 
            color: "#999", 
            marginTop: 30,
            fontSize: 16
          }}>
            No tasks yet. Add one to get started! 🎯
          </p>
        )}

        <div style={{ 
          marginTop: 30, 
          paddingTop: 20, 
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
          color: "#666",
          fontSize: 14
        }}>
          <p>
            <strong>{todos.filter(t => !t.completed).length}</strong> task(s) remaining
          </p>
        </div>
      </div>
    </div>
  );
}
