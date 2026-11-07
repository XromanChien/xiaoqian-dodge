import Phaser from 'phaser';
import { fetchLeaderboard, submitRun, normalizePlayerName, leaderboardConfigured } from '../services/leaderboard.js';

export default class LeaderboardScene extends Phaser.Scene {
  constructor() { super('LeaderboardScene'); }
  create({ result } = {}) {
    this.result = result;
    this.controller = new AbortController();
    this.busy = false;
    this.cameras.main.setBackgroundColor('#101d30');
    const panel = document.createElement('section');
    panel.className = 'leaderboard-panel';
    panel.innerHTML = `<h1>金幣排行榜</h1><p class="lb-subtitle">全球前 20 名 · 依每局金幣由高到低排序</p>
      <p class="lb-run"></p><form><label for="lb-name">玩家姓名</label><div class="lb-entry"><input id="lb-name" autocomplete="nickname" placeholder="輸入姓名（最多20字）" maxlength="40" required><button type="submit">登錄本局</button></div></form>
      <p class="lb-note">姓名與金幣會公開顯示。每局可登錄一次，同金幣並列名次。</p>
      <p class="lb-status" role="status" aria-live="polite"></p>
      <div class="lb-scroll"><table><thead><tr><th>名次</th><th>玩家</th><th>金幣</th></tr></thead><tbody></tbody></table></div>
      <div class="lb-actions"><button class="lb-refresh">重新整理</button><button class="lb-back">返回本局統計</button></div>`;
    const layout = document.createElement('div');
    layout.className = 'lb-layout';
    layout.append(...panel.childNodes);
    panel.append(layout);
    this.panel = panel;
    this.status = panel.querySelector('.lb-status');
    this.form = panel.querySelector('form');
    this.input = panel.querySelector('input');
    this.submitButton = this.form.querySelector('button');
    this.refreshButton = panel.querySelector('.lb-refresh');
    panel.querySelector('.lb-run').textContent = result ? `本局取得 ${result.coinsEarned} 金幣` : '無可登錄的本局紀錄';
    this.input.value = result?.leaderboardName || '';
    this.submitButton.disabled = !result || result.leaderboardSubmitted || !leaderboardConfigured;
    if (result?.leaderboardSubmitted) this.submitButton.textContent = '已登錄';
    this.form.onsubmit = event => { event.preventDefault(); this.submit(); };
    this.refreshButton.onclick = () => this.refresh();
    const backButton = panel.querySelector('.lb-back');
    backButton.textContent = result ? '返回本局統計' : '返回首頁';
    backButton.onclick = () => result ? this.scene.start('ResultScene', this.result) : this.scene.start('MenuScene');
    if (!result) {
      this.form.hidden = true;
      panel.querySelector('.lb-run').hidden = true;
      panel.querySelector('.lb-note').hidden = true;
    }
    this.add.dom(360, 640, panel);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.controller.abort();
      this.form.onsubmit = null;
      this.refreshButton.onclick = null;
      panel.querySelector('.lb-back').onclick = null;
      panel.remove();
    });
    this.refresh();
  }
  async refresh() {
    if (this.busy) return;
    this.busy = true; this.refreshButton.disabled = true;
    this.status.textContent = '正在讀取排名…';
    try {
      const rows = await fetchLeaderboard(this.controller.signal);
      if (this.controller.signal.aborted) return;
      const body = this.panel.querySelector('tbody'); body.replaceChildren();
      for (const row of rows) {
        const tr = document.createElement('tr');
        for (const value of [row.rank, row.player_name, row.coins]) {
          const td = document.createElement('td'); td.textContent = String(value); tr.append(td);
        }
        body.append(tr);
      }
      this.status.textContent = rows.length ? '已更新最新排名' : '目前還沒有紀錄，成為第一位挑戰者！';
    } catch (error) {
      if (!this.controller.signal.aborted) this.status.textContent = error.message;
    } finally {
      this.busy = false; this.refreshButton.disabled = false;
    }
  }
  async submit() {
    if (this.busy || !this.result || this.result.leaderboardSubmitted || !leaderboardConfigured) return;
    let name;
    try { name = normalizePlayerName(this.input.value); }
    catch (error) { this.status.textContent = error.message; return; }
    this.result.leaderboardName = name;
    this.busy = true; this.submitButton.disabled = true; this.refreshButton.disabled = true;
    this.status.textContent = '正在登錄本局…';
    try {
      await submitRun(this.result, name, this.controller.signal);
      if (this.controller.signal.aborted) return;
      this.result.leaderboardSubmitted = true;
      this.submitButton.textContent = '已登錄';
      this.busy = false;
      await this.refresh();
    } catch (error) {
      if (!this.controller.signal.aborted) this.status.textContent = error.message;
    } finally {
      this.busy = false; this.refreshButton.disabled = false;
      this.submitButton.disabled = Boolean(this.result.leaderboardSubmitted);
    }
  }
}

