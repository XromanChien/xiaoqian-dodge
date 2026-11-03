const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
export const leaderboardConfigured = Boolean(url && key);
export function normalizePlayerName(value) {
  const name = value.normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!name || [...name].length > 20 || /[\p{Cc}\p{Cf}<>]/u.test(name)) {
    throw new Error('請輸入 1～20 字姓名，不能含控制字元或 < >。');
  }
  return name;
}
async function rpc(method, body, signal) {
  if (!leaderboardConfigured) throw new Error('線上排行榜尚未開通，請稍後再試。');
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 12000);
  try {
    const response = await fetch(`${url}/rest/v1/rpc/${method}`, {
      method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: controller.signal,
    });
    if (!response.ok) throw new Error('排行榜暫時無法連線，請稍後重試。');
    return await response.json();
  } catch (error) {
    if (signal?.aborted) throw error;
    if (error.name === 'AbortError') throw new Error('連線逾時，請重試；同一局不會重複登錄。');
    if (error instanceof TypeError) throw new Error('無法連線，請確認網路後重試。');
    throw error;
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', abort);
  }
}
export const fetchLeaderboard = signal => rpc('get_coin_leaderboard', {}, signal);
export function submitRun(result, playerName, signal) {
  if (!Number.isSafeInteger(result.coinsEarned) || result.coinsEarned < 0) throw new Error('本局金幣資料無效。');
  return rpc('submit_coin_run', { p_run_id: result.runId, p_player_name: normalizePlayerName(playerName), p_coins: result.coinsEarned }, signal);
}
