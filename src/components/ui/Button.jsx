/**
 * Button component — wraps common button styles.
 * @param {{ variant: 'primary' | 'secondary' | 'gold', children, className, ...rest }} props
 */
export default function Button({ variant = 'primary', children, className = '', ...rest }) {
  const base =
    variant === 'gold'
      ? 'btn-gold'
      : variant === 'secondary'
      ? 'btn-secondary'
      : 'btn-primary';

  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}
