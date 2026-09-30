export default function Modal({ title, children, onClose, width = '520px' }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal" style={{ maxWidth: width }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose}>×</button>
        </div>
        {children}
      </section>
    </div>
  );
}
