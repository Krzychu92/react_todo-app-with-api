// /* eslint-disable jsx-a11y/control-has-associated-label */
// import React, { useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
// import { USER_ID, getTodos } from './api/todos';
// import { ToDoHeader } from './components/Header/Header';
// import { TodoList } from './components/TodoList/TodoList';
// import { Footer } from './components/Footer/Footer';
// import { Todo } from './types/Todo';
// import { Status } from './types/Status';
// import { errorType } from './types/ErrorType';
// import { Errors } from './components/Error/Error';

// export const App: React.FC = () => {
//   const [tasks, setTasks] = useState<Todo[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string>('');
//   const [status, setStatus] = useState<Status>(Status.all);
//   const [tempTodo, setTempTodo] = useState<Todo | null>(null);
//   const [isUpdating, setIsUpdating] = useState<number[] | []>([]);
//   const [IsSubmitting, setIsSubmitting] = useState(false);
//   const completedTodos = tasks?.filter(todo => todo.completed);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const taskLeft = tasks.length - completedTodos.length;

//   const focusInput = () => {
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 0);
//   };

//   const handleStatus = (value: Status) => {
//     setStatus(value);
//   };

//   const handleSetTasks = (newTasks: Todo[]) => {
//     setTasks(newTasks);
//   };

//   const handleError: (errorMsg: string) => void = errorMsg => {
//     setErrorMessage(errorMsg);
//   };

//   const handleErrorClear = () => {
//     setErrorMessage('');
//   };

//   const handleTempTodo = (todo: Todo | null) => {
//     setTempTodo(todo);
//   };

//   const handleIsSubmitting = (isSubmitting: boolean) => {
//     setIsSubmitting(isSubmitting);
//   };

//   const handleLoading = (idsArr: number[]) => {
//     setIsUpdating(idsArr);
//   };

//   useEffect(() => {
//     getTodos()
//       .then(setTasks)
//       .then(() => focusInput())
//       .catch(() => handleError(errorType.load));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => handleErrorClear(), 3000);

//     return () => clearTimeout(timeoutId);
//   }, [errorMessage]);

//   if (!USER_ID) {
//     return <UserWarning />;
//   }

//   return (
//     <div className="todoapp">
//       <h1 className="todoapp__title">todos</h1>

//       <div className="todoapp__content">
//         <ToDoHeader
//           completedTodos={completedTodos}
//           handleError={handleError}
//           inputRef={inputRef}
//           taskCounter={tasks.length}
//           handleTempTodo={handleTempTodo}
//           setTasks={setTasks}
//           tasks={tasks}
//           onFocus={focusInput}
//           handleIsSubmitting={handleIsSubmitting}
//           onLoading={handleLoading}
//           isSubmitting={IsSubmitting}
//         />
//         <TodoList
//           status={status}
//           tempTodo={tempTodo}
//           onUpdate={isUpdating}
//           handleError={handleError}
//           onNewTasks={handleSetTasks}
//           tasks={tasks}
//           onLoading={handleLoading}
//           handleIsSubmitting={handleIsSubmitting}
//           focusInput={focusInput}
//           setTasks={setTasks}
//         />

//         {tasks.length > 0 && (
//           <Footer
//             handleStatus={handleStatus}
//             status={status}
//             taskLeft={taskLeft}
//             completedTodos={completedTodos}
// setTasks={setTasks}
//             onLoading={handleLoading}
//             focusInput={focusInput}
//             handleError={handleError}
//           />
//         )}
//       </div>

//       <Errors errorMessage={errorMessage} OnErrorClean={handleErrorClear} />
//     </div>
//   );
// };
