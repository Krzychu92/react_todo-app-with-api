/* eslint-disable jsx-a11y/label-has-associated-control */
type TempTodoProps = {
  title: string;
};

export const TempTodo = ({ title }: TempTodoProps) => {
  return (
    <div data-cy="Todo" className="todo">
      <label htmlFor={title} className="todo__status-label">
        <input
          id={title}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
