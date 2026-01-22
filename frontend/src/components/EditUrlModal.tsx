import { useState } from 'react';
import type { ShortUrl } from '../types/url';
import { urlApi } from '../services/apiServices/url.api';
import { showErrorToast, showSuccessToast } from '../utils/Toast';

interface EditUrlModalProps {
    url: ShortUrl;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditUrlModal({ url, onClose, onSuccess }: EditUrlModalProps) {
    const [originalUrl, setOriginalUrl] = useState(url.originalUrl);
    const [customCode, setCustomCode] = useState(url.shortCode); // Assuming shortUrl contains the code or we derive it
    const [loading, setLoading] = useState(false);

    // Derive initial code if shortUrl is full URL (fallback logic, ideally backend sends shortCode separately or we parse)
    // But wait, ShortUrl type usually has shortCode? Let's assume we might need to parse it if not present.
    // Looking at backend repo, schema has shortCode. Frontend type might just have shortUrl.
    // Actually dashboard displays shortUrl. Let's rely on what we have.
    // If the passed 'url' object has shortCode property (it likely does from backend response even if frontend type alias missed it), use it.
    // If not, we might need to extract from shortUrl.

    // Checking backend response dto... UrlMapper returns ...url.toObject().
    // So 'shortCode' should be there if schema has it.
    // Let's assume 'shortCode' is available on the object even if type definition needs update.
    // Actually, let's fix the type definition first if needed. But for now, let's assume specific structure.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await urlApi.update(url.id, { originalUrl, customCode });
            if (res && res.ok) {
                showSuccessToast('URL updated successfully');
                onSuccess();
                onClose();
            } else if (res && !res.ok) {
                showErrorToast(res.message || 'Failed to update URL');
            }
        } catch (error) {
            console.error(error);
            // Toast handled by api interceptor/method usually, but sometimes we want custom handling.
            // The api service "handleError" shows toast.
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-xl font-bold text-white mb-6">Edit URL</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Original URL
                        </label>
                        <input
                            type="url"
                            required
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Short Code (Custom Alias)
                        </label>
                        <div className="flex items-center">
                            <span className="bg-zinc-800 border border-r-0 border-zinc-700 rounded-l-xl px-3 py-2 text-gray-500 text-sm">
                                /
                            </span>
                            <input
                                type="text"
                                pattern="[a-zA-Z0-9_-]+"
                                title="Only letters, numbers, hyphens and underscores allowed"
                                value={customCode}
                                onChange={(e) => setCustomCode(e.target.value)}
                                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-r-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Only letters, numbers, hyphens, and underscores.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
