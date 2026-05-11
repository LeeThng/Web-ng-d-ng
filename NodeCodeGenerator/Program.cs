using System;
using System.IO;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace NodeCodeGenerator
{
    class Program
    {
        // Điều chỉnh đường dẫn gốc của project Node.js
        static string baseDir = @"D:\My folder\Web-ng-d-ng\myapp";

        static void Main(string[] args)
        {
            string connString = "server=127.0.0.1;user=root;database=dental_shop;port=3306;password=;";
            MySqlConnection conn = new MySqlConnection(connString);

            try
            {
                conn.Open();
                Console.WriteLine("🚀 Bắt đầu tiến trình sinh code toàn diện...");

                List<string> tables = new List<string>();
                MySqlCommand cmd = new MySqlCommand("SHOW TABLES", conn);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read()) tables.Add(reader.GetString(0));
                }

                // Tạo các thư mục nếu chưa có
                string modelDir = Path.Combine(baseDir, "models");
                string controllerDir = Path.Combine(baseDir, "controllers");
                if (!Directory.Exists(modelDir)) Directory.CreateDirectory(modelDir);
                if (!Directory.Exists(controllerDir)) Directory.CreateDirectory(controllerDir);

                foreach (var tableName in tables)
                {
                    // 1. Sinh Model
                    GenerateModelFile(tableName, modelDir);

                    // 2. Sinh Controller
                    GenerateControllerFile(tableName, controllerDir);

                    Console.WriteLine($"[Success] Đã sinh bộ đôi: {tableName}Model.js & {tableName}Controller.js");
                }
            }
            catch (Exception ex) { Console.WriteLine("❌ Lỗi: " + ex.Message); }
            finally { conn.Close(); }

            Console.WriteLine("\nHoàn tất Giai đoạn 2! Nhấn phím bất kỳ để kết thúc...");
            Console.ReadKey();
        }

        static void GenerateModelFile(string tableName, string path)
        {
            string template = $@"const db = require('../db');
const {tableName}Model = {{
    getAll: (callback) => {{
        db.query('SELECT * FROM {tableName}', callback);
    }},
    getById: (id, callback) => {{
        db.query('SELECT * FROM {tableName} WHERE id = ?', [id], callback);
    }}
}};
module.exports = {tableName}Model;";
            File.WriteAllText(Path.Combine(path, $"{tableName}Model.js"), template);
        }

        static void GenerateControllerFile(string tableName, string path)
        {
            string template = $@"const Model = require('../models/{tableName}Model');

const {tableName}Controller = {{
    list: (req, res) => {{
        Model.getAll((err, results) => {{
            if (err) return res.status(500).send(err);
            res.render('{tableName}', {{ data: results }});
        }});
    }},
    detail: (req, res) => {{
        Model.getById(req.params.id, (err, result) => {{
            if (err) return res.status(500).send(err);
            res.render('{tableName}_detail', {{ item: result[0] }});
        }});
    }}
}};
module.exports = {tableName}Controller;";
            File.WriteAllText(Path.Combine(path, $"{tableName}Controller.js"), template);
        }
    }
}