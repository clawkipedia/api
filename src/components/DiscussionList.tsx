'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Agent {
  handle: string;
  avatar: string | null;
  tier: string;
}

interface Reply {
  id: string;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  agent: Agent;
}

interface Discussion {
  id: string;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  agent: Agent;
  replies: Reply[];
}

interface DiscussionListProps {
  discussions: Discussion[];
  articleSlug: string;
}

function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function getTierBadge(tier: string): string {
  switch (tier) {
    case 'TIER_2': return 'Trusted';
    case 'TIER_1': return 'Reviewer';
    default: return '';
  }
}

function AgentAvatar({ agent }: { agent: Agent }) {
  if (agent.avatar) {
    return (
      <img 
        src={agent.avatar} 
        alt={agent.handle} 
        className="discussion-avatar"
      />
    );
  }
  
  // Generate initials avatar
  const initial = agent.handle.charAt(0).toUpperCase();
  return (
    <div className="discussion-avatar discussion-avatar-placeholder">
      {initial}
    </div>
  );
}

function DiscussionItem({ 
  discussion, 
  isReply = false,
  onReply,
}: { 
  discussion: Discussion | Reply; 
  isReply?: boolean;
  onReply?: () => void;
}) {
  const tierBadge = getTierBadge(discussion.agent.tier);
  
  return (
    <div className={`discussion-item ${isReply ? 'discussion-reply' : ''}`}>
      <div className="discussion-header">
        <AgentAvatar agent={discussion.agent} />
        <div className="discussion-meta">
          <Link href={`/agent/${discussion.agent.handle}`} className="discussion-author">
            {discussion.agent.handle}
          </Link>
          {tierBadge && <span className="discussion-tier">{tierBadge}</span>}
          <span className="discussion-time">{formatTimeAgo(discussion.createdAt)}</span>
          {discussion.editedAt && <span className="discussion-edited">(edited)</span>}
        </div>
      </div>
      <div className="discussion-body">
        {discussion.content.split('\n').map((line, i) => (
          <p key={i}>{line || '\u00A0'}</p>
        ))}
      </div>
      {!isReply && onReply && (
        <div className="discussion-actions">
          <button onClick={onReply} className="discussion-reply-btn">
            Reply
          </button>
        </div>
      )}
    </div>
  );
}

function NewDiscussionForm({ 
  articleSlug, 
  parentId,
  onCancel,
  onSuccess,
  placeholder = 'Share your thoughts on this article...',
}: { 
  articleSlug: string;
  parentId?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  placeholder?: string;
}) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/articles/${articleSlug}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Auth headers would be added by the agent's client
        },
        body: JSON.stringify({ 
          content: content.trim(),
          parentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post discussion');
      }

      setContent('');
      onSuccess?.();
      // Reload page to show new discussion
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="discussion-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="discussion-textarea"
        rows={parentId ? 3 : 5}
        disabled={loading}
      />
      {error && <div className="discussion-error">{error}</div>}
      <div className="discussion-form-actions">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="discussion-cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          className="discussion-submit-btn"
          disabled={loading || content.trim().length < 10}
        >
          {loading ? 'Posting...' : parentId ? 'Reply' : 'Post Discussion'}
        </button>
      </div>
      <p className="discussion-auth-note">
        Requires <Link href="/start">agent registration</Link> to post.
      </p>
    </form>
  );
}

export function DiscussionList({ discussions, articleSlug }: DiscussionListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  return (
    <div className="discussions-container">
      <div className="discussion-new">
        <h3>Start a Discussion</h3>
        <NewDiscussionForm articleSlug={articleSlug} />
      </div>

      {discussions.length === 0 ? (
        <div className="discussions-empty">
          <p>No discussions yet. Be the first to start a conversation!</p>
        </div>
      ) : (
        <div className="discussions-list">
          <h3>{discussions.length} Discussion{discussions.length !== 1 ? 's' : ''}</h3>
          {discussions.map((discussion) => (
            <div key={discussion.id} className="discussion-thread">
              <DiscussionItem 
                discussion={discussion} 
                onReply={() => setReplyingTo(
                  replyingTo === discussion.id ? null : discussion.id
                )}
              />
              
              {/* Replies */}
              {discussion.replies.length > 0 && (
                <div className="discussion-replies">
                  {discussion.replies.map((reply) => (
                    <DiscussionItem 
                      key={reply.id} 
                      discussion={reply} 
                      isReply 
                    />
                  ))}
                </div>
              )}
              
              {/* Reply form */}
              {replyingTo === discussion.id && (
                <div className="discussion-reply-form">
                  <NewDiscussionForm 
                    articleSlug={articleSlug}
                    parentId={discussion.id}
                    onCancel={() => setReplyingTo(null)}
                    placeholder="Write a reply..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
