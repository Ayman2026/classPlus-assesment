/**
 * Editor page — loads template by ID from URL params,
 * renders the CardEditor, and provides the ShareModal.
 */
import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById } from '../lib/templates';
import CardEditor from '../components/editor/CardEditor';
import ShareModal from '../components/modals/ShareModal';
import Navbar from '../components/layout/Navbar';

export default function Editor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <h2>Template not found</h2>
        <button className="btn-primary" onClick={() => navigate('/home')} style={{ marginTop: 20 }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <CardEditor template={template} onBack={() => navigate('/home')} />
      <ShareModal canvasRef={canvasRef} />
    </div>
  );
}
