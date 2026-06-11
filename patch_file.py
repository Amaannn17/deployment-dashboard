import re

with open('index.html', 'r') as f:
    content = f.read()

old_content = """        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
        }

        .controls { display: flex; gap: 10px; }

        .dashboard-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
        }

        .chart-card {
            background-color: var(--surface);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 320px;
        }

        .upload-card {
            background-color: var(--surface);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }"""

new_content = """        .header {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
        }

        .controls { display: flex; gap: 10px; }

        .dashboard-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
            justify-content: flex-start;
        }

        .chart-card {
            background-color: var(--surface);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 320px;
            box-sizing: border-box;
        }

        .upload-card {
            background-color: var(--surface);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            flex: 1 1 300px;
            max-width: 450px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }"""

if old_content in content:
    content = content.replace(old_content, new_content)
    with open('index.html', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Not found")
