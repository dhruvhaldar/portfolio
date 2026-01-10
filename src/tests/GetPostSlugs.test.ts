import { describe, it, expect, vi } from 'vitest';
import * as utils from '../app/utils/utils';

describe('getPostSlugs Optimization', () => {
  it('returns only slugs without reading content', async () => {
      // Create a spy on fs.readFileSync to ensure it is NOT called
      const fs = require('fs');
      const readFileSyncSpy = vi.spyOn(fs, 'readFileSync');

      // Mock fs to simulate files so we don't rely on real file system
      vi.spyOn(fs, 'readdirSync').mockReturnValue(['post1.mdx', 'post2.mdx']);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const slugs = utils.getPostSlugs(["some", "path"]);

      expect(slugs).toEqual(['post1', 'post2']);
      expect(readFileSyncSpy).not.toHaveBeenCalled();

      vi.restoreAllMocks();
  });
});
