// import { errorType } from '../../types/ErrorType';
// import { Todo } from '../../types/Todo';

// type Props = {
//   handleError: (error: string) => void;
//   tasks: Todo[];
//   onNewTasks: (tasks: Todo[]) => void;
//   onLoading: (ids: number[]) => void;
//   handleIsSubmitting: (isSubmitting: boolean) => void;
// };
// export const TodoEditForm = ({
//   handleError,
//   tasks,
//   onNewTasks,
//   onLoading,
//   handleIsSubmitting,
// }: Props) => {
//   const updateNewTitle = (id: number, newTitl: string) => {
//     const updateTitle = newTitl.trim();
//     const todoToUpdate = tasks.find(todo => todo.id === id);

//     if (!todoToUpdate) {
//       handleError(errorType.found);

//       return;
//     }

//     if (todoToUpdate.title === updateTitle) {
//       return;
//     }

//     const updatedTodo = { ...todoToUpdate, title: updateTitle };

//     const updatedTasks = tasks.map(todo =>
//       todo.id === id ? updatedTodo : todo,
//     );

//     if (newTitle.trim() === '') {
//       deleteTask(id);
//     }

//     updateTitleTodo(id, updatedTodo)
//       .then(() => {
//         onNewTasks(updatedTasks);
//         onLoading([]);
//         setCanEdit(false);
//       })
//       .catch(() => {
//         handleError(errorType.updateTodo);

//         setCanEdit(true);
//         editRef.current = id;
//         const revertedTasks = tasks.map(todo =>
//           todo.id === id ? { ...todo, title: todoToUpdate.title } : todo,
//         );

//         onNewTasks(revertedTasks);

//         onLoading([]);
//       });
//     handleIsSubmitting(false);
//   };

//   const handleSubmitNewTitle = (id: number, title: string) => {
//     const originalTodo = tasks.find(todo => todo.id === id);

//     if (!originalTodo) {
//       handleError(errorType.found);

//       return;
//     }

//     const trimmedTitle = title.trim();

//     if (originalTodo.title === trimmedTitle) {
//       return;
//     }

//     if (!trimmedTitle) {
//       deleteTask(id);
//       handleIsSubmitting(false);

//       return;
//     }

//     handleIsSubmitting(true);
//     onLoading([id]);
//     updateNewTitle(id, trimmedTitle);
//   };

//   const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewTitle((e.target as HTMLInputElement).value);
//   };

//   const sendTitle = (id: number) => {
//     handleSubmitNewTitle(id, newTitle);
//     setCanEdit(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Escape') {
//       setCanEdit(false);
//     }
//   };

//   return (
//     <form
//       key={id}
//       onSubmit={e => {
//         e.preventDefault();
//         sendTitle(id);
//       }}
//       onBlur={e => {
//         e.preventDefault();
//         sendTitle(id);
//       }}
//     >
//       <input
//         data-cy="TodoTitleField"
//         type="text"
//         className="todo__title-field"
//         placeholder="Empty todo will be deleted"
//         value={newTitle}
//         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//           handleTitleChange(e)
//         }
//         autoFocus={true}
//         onKeyDown={handleKeyDown}
//       />
//     </form>
//   );
// };
