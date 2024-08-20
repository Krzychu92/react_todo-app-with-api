import classNames from 'classnames';

type Props = {
  errorMessage: string;
  OnErrorClean: () => void;
};

export const Errors = ({ errorMessage, OnErrorClean }: Props) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
    >
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        id="Error"
        name="Error"
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={OnErrorClean}
      />
      {errorMessage}
    </div>
  );
};
