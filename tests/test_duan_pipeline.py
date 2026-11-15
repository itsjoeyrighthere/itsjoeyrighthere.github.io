"""Run with python3 -m unittest discover -s tests -p 'test_*.py'."""
import json
from pathlib import Path
import runpy
import shutil
import subprocess
import sys
import tempfile
import types
import unittest
from unittest.mock import patch


REPO = Path(__file__).resolve().parents[1]


class DuanPipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.data = self.root / 'src/data/duan'
        for folder in ('scripts', 'src/data/duan', 'src/content/posts', 'public/library/duan'):
            (self.root / folder).mkdir(parents=True, exist_ok=True)
        for name in ('build-duan-index.py', 'import-duan-pdf.py'):
            shutil.copyfile(REPO / 'scripts' / name, self.root / 'scripts' / name)

    def write_json(self, name, value):
        (self.data / name).write_text(json.dumps(value, ensure_ascii=False))

    def fixture(self):
        self.write_json('manifest.json', {
            'chunks': 1, 'chunkSize': 50, 'pageCount': 1,
            'bookmarks': [{'title': '测试文章', 'page': 1}],
        })
        self.write_json('001.json', {
            'start': 1, 'pages': ['测试文章\n发表于：2020-01-01 12:00:00\n正文。\n'],
        })

    def build(self):
        return subprocess.run(
            [sys.executable, str(self.root / 'scripts/build-duan-index.py')],
            capture_output=True, text=True,
        )

    def test_builder_ignores_chunks_outside_manifest(self):
        self.fixture()
        shutil.copyfile(self.data / '001.json', self.data / '002.json')
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr)
        articles = json.loads((self.data / 'articles.json').read_text())
        self.assertEqual(len(articles), 1)
        self.assertEqual(articles[0]['body'], ['正文。'])

    def test_builder_rejects_invalid_page_range_before_writing(self):
        self.fixture()
        self.write_json('001.json', {'start': 2, 'pages': ['wrong page']})
        result = self.build()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Invalid page range', result.stderr)
        self.assertFalse((self.data / 'articles.json').exists())

    def test_importing_shorter_source_removes_only_stale_numeric_chunks(self):
        self.write_json('002.json', {'start': 51, 'pages': ['old page']})
        self.write_json('articles.json', ['keep derived data'])
        self.write_json('123-notes.json', ['keep notes'])
        source = self.root / 'source.pdf'
        source.write_bytes(b'PDF parser input')
        reader = types.SimpleNamespace(
            pages=[types.SimpleNamespace(extract_text=lambda: 'new page')], outline=[],
        )
        parser = types.ModuleType('pypdf')
        parser.PdfReader = lambda path: reader
        script = self.root / 'scripts/import-duan-pdf.py'
        with patch.dict(sys.modules, {'pypdf': parser}), \
                patch.object(sys, 'argv', [str(script), str(source)]), \
                patch('builtins.print'):
            runpy.run_path(str(script), run_name='__main__')
        self.assertFalse((self.data / '002.json').exists())
        self.assertEqual(json.loads((self.data / '001.json').read_text())['pages'], ['new page'])
        self.assertEqual(json.loads((self.data / 'manifest.json').read_text())['chunks'], 1)
        self.assertTrue((self.data / 'articles.json').exists())
        self.assertTrue((self.data / '123-notes.json').exists())


if __name__ == '__main__':
    unittest.main()
