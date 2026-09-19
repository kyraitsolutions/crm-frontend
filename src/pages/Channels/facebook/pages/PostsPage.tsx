import { Button } from "@/components/ui/button";
import DataLoader from "@/components/Loader/data-loader";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import type { ApiError } from "@/types";
import { ExternalLink, Heart, MessageCircle, RefreshCcw, Share2 } from "lucide-react";
import { Newspaper } from "lucide-react";
import { useEffect } from "react";
import { EmptyState } from "../components/EmptyState";
import { FacebookPageShell } from "../components/FacebookPageShell";
import { PermissionWarning } from "../components/PermissionWarning";
import { GlassCard } from "@/pages/Channels/whatsapp/components/cards/GlassCard";
import { useMetaPageStore } from "../store/meta-page.store";
import { formatFacebookDate, formatFacebookNumber } from "../utils/format";

const PostsPage = () => {
  const accountId = useAuthStore((state) => state.accountId);
  const toastService = new ToastMessageService();
  const {
    posts,
    postsPaging,
    postsWarning,
    postsLoading,
    postsLoadingMore,
    fetchPosts,
  } = useMetaPageStore((state) => state);

  const loadPosts = async (after?: string) => {
    if (!accountId) return;
    try {
      await fetchPosts(String(accountId), after);
    } catch (error) {
      const err = error as ApiError;
      toastService.error(err.message || "Failed to load Facebook posts");
    }
  };

  useEffect(() => {
    loadPosts();
  }, [accountId]);

  return (
    <FacebookPageShell>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Posts</h2>
          <p className="text-sm text-slate-500">
            Recent published posts from the connected Facebook Page.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => loadPosts()}
          disabled={postsLoading}
        >
          <RefreshCcw className="size-4" />
          Refresh
        </Button>
      </div>

      <PermissionWarning message={postsWarning} />

      {postsLoading ? (
        <DataLoader className="h-[40vh]" />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts to show"
          description="When this Page publishes posts, they will appear here. If a permission warning is shown, reconnect Facebook after adding pages_read_engagement."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <GlassCard key={post.id} className="flex flex-col overflow-hidden">
              {post.picture ? (
                <img
                  src={post.picture}
                  alt=""
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-32 items-center justify-center bg-blue-50 text-blue-400">
                  <Newspaper className="size-8" />
                </div>
              )}

              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="line-clamp-4 text-sm text-slate-700">
                  {post.message || post.story || "Untitled post"}
                </p>

                <p className="text-xs text-slate-400">
                  {formatFacebookDate(post.createdTime)}
                </p>

                <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="size-3.5" />
                      {formatFacebookNumber(post.likes)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="size-3.5" />
                      {formatFacebookNumber(post.comments)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Share2 className="size-3.5" />
                      {formatFacebookNumber(post.shares)}
                    </span>
                  </div>

                  {post.permalink ? (
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
                    >
                      Open
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {postsPaging?.after ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={postsLoadingMore}
            onClick={() => loadPosts(postsPaging.after ?? undefined)}
          >
            {postsLoadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      ) : null}
    </FacebookPageShell>
  );
};

export default PostsPage;
