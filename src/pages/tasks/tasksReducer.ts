import type { Task } from "../../api/tasks";

export interface TasksState {
  tasks: Task[];          // all tasks from backend
  filteredTasks: Task[];  // tasks after applying filters
  loading: boolean;
  error: string | null;
  filters: {
    title: string;
    description: string;
    priority: string;
    status: string;      // "completed", "incomplete", or ""
    dueFrom: string;     // "YYYY-MM-DD"
    dueTo: string;       // "YYYY-MM-DD"
  };
}

export type TasksAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Task[] }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: number }
  | { type: "SET_FILTER"; payload: { field: string; value: string } }
  | { type: "RESET_FILTERS" };

export const initialState: TasksState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filters: {
    title: "",
    description: "",
    priority: "",
    status: "",
    dueFrom: "",
    dueTo: "",
  },
};

export const tasksReducer = (
  state: TasksState,
  action: TasksAction
): TasksState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        filteredTasks: action.payload, // initially no filter
      };
    case "SET_FILTER":
      const newFilters = { ...state.filters, [action.payload.field]: action.payload.value };

      const filtered = state.tasks.filter((task) => {
        const dueDate = new Date(task.due_date);
        const from = newFilters.dueFrom ? new Date(newFilters.dueFrom) : null;
        const to = newFilters.dueTo ? new Date(newFilters.dueTo) : null;

        return (
          (!newFilters.title || task.title.toLowerCase().includes(newFilters.title.toLowerCase())) &&
          (!newFilters.description || (task.description && task.description.toLowerCase().includes(newFilters.description.toLowerCase()))) &&
          (!newFilters.priority || task.priority === newFilters.priority) &&
          (!newFilters.status || (newFilters.status === "completed" ? task.is_completed : !task.is_completed)) &&
          (!from || dueDate >= from) &&
          (!to || dueDate <= to)
        );
      });

      return { ...state, filters: newFilters, filteredTasks: filtered };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: {
          title: "",
          description: "",
          priority: "",
          status: "",
          dueFrom: "",
          dueTo: "",
        },
      };


    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
};
