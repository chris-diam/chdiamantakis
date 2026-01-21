import React from 'react';
import { BuildingType } from './SpaceBuilding';

interface PortfolioModalProps {
  type: BuildingType | null;
  onClose: () => void;
}

const PORTFOLIO_CONTENT: Record<BuildingType, {
  title: string;
  icon: string;
  content: React.ReactNode;
}> = {
  about: {
    title: 'Mission Commander',
    icon: '👨‍🚀',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-4xl border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30">
            👨‍🚀
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Christos Diamantakis</h3>
            <p className="text-cyan-400">Full Stack Developer • Space Explorer</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">
          Welcome to my lunar base! I'm a passionate full-stack developer
          with experience building modern web applications. I love creating innovative
          solutions and exploring new technologies across the digital universe.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
            <p className="text-cyan-400 text-sm">📍 Home Base</p>
            <p className="text-white">Greece 🇬🇷</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
            <p className="text-purple-400 text-sm">🚀 Mission Time</p>
            <p className="text-white">3+ Years</p>
          </div>
        </div>
      </div>
    ),
  },
  techstack: {
    title: 'Technology Arsenal',
    icon: '🛰️',
    content: (
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-green-400 mb-3">🖥️ Navigation Systems (Frontend)</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Three.js', 'Vite'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">⚡ Power Core (Backend)</h4>
          <div className="flex flex-wrap gap-2">
            {['Node.js', 'Express', 'Socket.io', 'GraphQL', 'REST APIs'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-purple-400 mb-3">🗄️ Data Storage & Launch Systems</h4>
          <div className="flex flex-wrap gap-2">
            {['MongoDB', 'PostgreSQL', 'Docker', 'Nginx', 'Keycloak', 'MinIO'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  projects: {
    title: 'Mission Log',
    icon: '🚀',
    content: (
      <div className="space-y-4">
        {[
          {
            name: 'Lunar Base Portfolio',
            description: 'This 3D multiplayer space station built with React Three Fiber and Socket.io',
            tags: ['React', 'Three.js', 'Socket.io', 'MongoDB'],
            color: 'from-orange-500 to-red-500',
            status: '🟢 Active Mission',
          },
          {
            name: 'Galactic Marketplace',
            description: 'Full-stack e-commerce solution with payment integration and admin dashboard',
            tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Docker'],
            color: 'from-cyan-500 to-blue-500',
            status: '✅ Completed',
          },
          {
            name: 'Interstellar Comms',
            description: 'Scalable chat application with rooms, direct messages, and file sharing',
            tags: ['React', 'Socket.io', 'Node.js', 'Redis'],
            color: 'from-green-500 to-emerald-500',
            status: '✅ Completed',
          },
        ].map((project) => (
          <div
            key={project.name}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 hover:border-cyan-500/30"
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${project.color}`} />
              <span className="text-xs text-gray-400">{project.status}</span>
            </div>
            <h4 className="text-lg font-semibold text-white">{project.name}</h4>
            <p className="text-gray-400 text-sm mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded text-xs border border-cyan-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  contact: {
    title: 'Contact',
    icon: '📧',
    content: (
      <div className="space-y-6">
        <p className="text-gray-300">
          Feel free to reach out! I'm always open to discussing new projects,
          creative ideas, or opportunities to be part of your vision.
        </p>
        <div className="space-y-3">
          {[
            { icon: '📧', label: 'Email', value: 'christos@example.com', href: 'mailto:christos@example.com' },
            { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/chdiamantakis', href: 'https://linkedin.com' },
            { icon: '🐙', label: 'GitHub', value: 'github.com/chdiamantakis', href: 'https://github.com' },
          ].map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">{contact.icon}</span>
              <div>
                <p className="text-gray-400 text-sm">{contact.label}</p>
                <p className="text-white">{contact.value}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30">
          <p className="text-center text-white">
            💡 <span className="font-semibold">Pro tip:</span> Walk around and explore the world!
          </p>
        </div>
      </div>
    ),
  },
};

export function PortfolioModal({ type, onClose }: PortfolioModalProps) {
  if (!type) return null;

  const content = PORTFOLIO_CONTENT[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{content.icon}</span>
            <h2 className="text-xl font-bold text-white">{content.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {content.content}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
