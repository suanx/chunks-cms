import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('应该正确加载首页', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/淳渔/);
  });

  test('应该显示导航栏', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.logo')).toContainText('淳渔');
  });

  test('应该显示推荐视频区域', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.section-title').first()).toBeVisible();
  });

  test('搜索框应可操作', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('.search-box input');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('测试搜索');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/keyword=测试搜索/);
  });
});

test.describe('视频页面', () => {
  test('视频列表页应正确加载', async ({ page }) => {
    await page.goto('/video');
    await expect(page.locator('.section-title')).toContainText('视频列表');
  });
});

test.describe('影视剧页面', () => {
  test('影视剧列表页应正确加载', async ({ page }) => {
    await page.goto('/movie');
    await expect(page.locator('.section-title')).toContainText('影视剧');
  });
});
