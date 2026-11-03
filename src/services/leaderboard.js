import { supabase, leaderboardConfigured } from './supabaseClient.js';
export { leaderboardConfigured } from './supabaseClient.js';

export function normalizePlayerName(value) {
  const name = String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ');
  if (!name || [...name].length > 20 || /[\p{Cc}\p{Cf}<>]/u.test(name)) {
    throw new Error('請輸入 1～20 字姓名，不能含控制字元或 < >。');
  }
  return name;
}
async function withRequest(action, signal) {
  if (!leaderboardConfigured) throw new Error('線上排行榜尚未開通，請稍後再試。');
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 12000);
  try {
    return await action(controller.signal);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (controller.signal.aborted) throw new Error('連線逾時，請重試；同一局不會重複登錄。');
    throw new Error('排行榜暫時無法連線，請確認網路後重試。');
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', abort);
  }
}
export function fetchLeaderboard(signal) {
  return withRequest(async requestSignal => {
    // 讀取排行榜
    const { data, error: leaderboardError } = await supabase.rpc('get_coin_leaderboard')
      .abortSignal(requestSignal);
    if (leaderboardError) throw leaderboardError;
    return data ?? [];
  }, signal);
}
export function submitRun(result, playerName, signal) {
  playerName = normalizePlayerName(playerName);
  const coins = result.coinsEarned; // 本局金幣，不是累積錢包金幣。
  if (!Number.isSafeInteger(coins) || coins < 0 || coins > 1000000) throw new Error('本局金幣資料無效。');
  // ResultScene normally creates this ID. Keep it unchanged for retries/back navigation.
  result.runId ??= crypto.randomUUID();
  return withRequest(async requestSignal => {
    // 提交分數
    const { error } = await supabase.rpc('submit_coin_run', {
      p_run_id: result.runId,
      p_player_name: playerName,
      p_coins: coins,
    }).abortSignal(requestSignal);
    if (error) throw error;
  }, signal);
}
