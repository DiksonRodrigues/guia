import { supabase } from './supabase';

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      console.log('Erro ao conectar ou tabela não existe:', error.message);
      return false;
    }
    console.log('Conexão estabelecida com sucesso!');
    return true;
  } catch (err) {
    console.error('Falha catastrófica:', err);
    return false;
  }
}
