const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lciqfwycknwtrmketjzb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaXFmd3lja253dHJta2V0anpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjAxNDcsImV4cCI6MjA5MDI5NjE0N30.1O4eIZ3033aD8nGlF3CWjOPisPM4aPZHlns8nYC7Uhk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('groups').select('*').limit(1);
  console.log(error ? error : Object.keys(data[0] || {}));
}
check();
