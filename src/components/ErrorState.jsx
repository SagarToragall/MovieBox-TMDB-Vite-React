export function ErrorState({
  title = 'Something went wrong',
  message,
  actionLabel = 'Retry',
  onAction,
}) {
  return (
    <div className="panel center" role="alert">
      <div className="errorTitle">{title}</div>
      {message ? <div className="errorMessage">{message}</div> : null}
      {onAction ? (
        <button type="button" className="primaryButton" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

