// tests/outputEngine.test.js
import * as oe from '../src/core/outputEngine';

describe('outputEngine API', () => {
  it('exports the expected functions', () => {
    expect(typeof oe.copyText).toBe('function');
    expect(typeof oe.copyHTML).toBe('function');
    expect(typeof oe.downloadHTML).toBe('function');
    expect(typeof oe.emailLOI).toBe('function');
    expect(typeof oe.handleLOIOutput).toBe('function');
  });
});

describe('copyText', () => {
  it('writes text to clipboard if supported', async () => {
    await oe.copyText('hello');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
  });

  it('warns if clipboard not supported', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    delete navigator.clipboard;
    oe.copyText('foo');
    expect(warnSpy).toHaveBeenCalledWith('Clipboard API not supported');
    warnSpy.mockRestore();
  });
});

describe('copyHTML', () => {
  it('writes HTML to clipboard as rich text', async () => {
    const html = '<p>hi</p>';
    await oe.copyHTML(html);
    expect(navigator.clipboard.write).toHaveBeenCalled();
    const [[items]] = navigator.clipboard.write.mock.calls;
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveProperty('items');
  });

  it('warns if clipboard not supported', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    delete navigator.clipboard;
    oe.copyHTML('<p>no</p>');
    expect(warnSpy).toHaveBeenCalledWith('Clipboard API not supported');
    warnSpy.mockRestore();
  });
});

describe('downloadHTML', () => {
  it('creates a blob link, appends to body, clicks it, and cleans up', () => {
    const clickMock = jest.fn();
    jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    jest.spyOn(document, 'createElement').mockReturnValue({ href: '', download: '', click: clickMock });

    oe.downloadHTML('file.html', '<div>hi</div>');

    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});

describe('emailLOI', () => {
  it('sets window.location.href to a mailto link', () => {
    window.location.href = '';
    oe.emailLOI('a@b.com', 'Subj', 'Body');
    expect(window.location.href).toMatch(/^mailto:a@b\.com\?/);
  });
});

describe('handleLOIOutput', () => {
  it('performs all actions when options are set', () => {
    const loi = { text: 'Subj\nbody', html: '<p>body</p>' };

    // Call under test
    oe.handleLOIOutput(loi, {
      copyPlain: true,
      copyRich: true,
      download: true,
      email: 'test@x.com'
    });

    // 1) Plain-text copy
    expect(navigator.clipboard.writeText)
      .toHaveBeenCalledWith(loi.text);

    // 2) Rich HTML copy
    expect(navigator.clipboard.write)
      .toHaveBeenCalled();
    
    // 3) Download link created
    expect(URL.createObjectURL)
      .toHaveBeenCalledWith(expect.any(Blob));

    // 4) Email link navigation
    expect(window.location.href)
      .toMatch(/^mailto:test@x\.com\?/);
  });
});
