"""Static file server for local preview. Reads the port from the PORT
environment variable (falls back to 8080) instead of hardcoding it, so it
doesn't collide with whatever else is already bound to a fixed port."""
import http.server
import os
import socketserver
import sys

port = int(os.environ.get("PORT", 8080))
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", port), Handler) as httpd:
	httpd.allow_reuse_address = True
	print(f"Serving at http://localhost:{port}  (Ctrl+C to stop)")
	sys.stdout.flush()
	try:
		httpd.serve_forever()
	except KeyboardInterrupt:
		print("\nServer stopped.")
