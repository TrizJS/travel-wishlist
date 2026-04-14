import { supabase } from '../lib/supabase';

export const getDestinations = async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addDestination = async (destination, userId) => {
  const { name, country, category, rating, notes, visited } = destination;
  const { data, error } = await supabase
    .from('destinations')
    .insert({ name, country, category, rating, notes, visited, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateDestination = async (destination) => {
  const { id, name, country, category, rating, notes, visited } = destination;
  const { error } = await supabase
    .from('destinations')
    .update({ name, country, category, rating, notes, visited })
    .eq('id', id);
  if (error) throw error;
};

export const deleteDestination = async (id) => {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
