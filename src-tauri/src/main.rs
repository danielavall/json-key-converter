#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use heck::{ToLowerCamelCase, ToSnakeCase};
use serde_json::{Map, Value};

fn process_value(val: &Value, to_snake: bool, sort_keys: bool) -> Value {
    match val {
        Value::Object(map) => {
            let mut new_map = Map::new();
            let mut keys: Vec<&String> = map.keys().collect();

            if sort_keys {
                keys.sort();
            }

            for k in keys {
                if let Some(v) = map.get(k) {
                    let new_key = if to_snake {
                        k.to_snake_case()
                    } else {
                        k.to_lower_camel_case()
                    };
                    new_map.insert(new_key, process_value(v, to_snake, sort_keys));
                }
            }
            Value::Object(new_map)
        }
        Value::Array(arr) => {
            Value::Array(arr.iter().map(|v| process_value(v, to_snake, sort_keys)).collect())
        }
        _ => val.clone(),
    }
}

#[tauri::command]
fn convert_json_keys(json_str: &str, format: &str, sort_keys: bool) -> Result<String, String> {
    let parsed: Value = serde_json::from_str(json_str).map_err(|e| e.to_string())?;
    
    let to_snake = format == "camel_to_snake";
    let converted = process_value(&parsed, to_snake, sort_keys);
    
    serde_json::to_string_pretty(&converted).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_json_keys])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
