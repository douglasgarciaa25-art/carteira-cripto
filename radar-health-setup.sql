-- Vistoria 24h. Aplicado no Supabase; não contém segredos.
create table if not exists public.radar_health_reports (
 user_id uuid primary key references auth.users(id) on delete cascade,
 checked_at timestamptz,
 report jsonb
);
alter table public.radar_health_reports enable row level security;
revoke all on public.radar_health_reports from anon, authenticated;
grant select on public.radar_health_reports to authenticated;
grant select,insert,update,delete on public.radar_health_reports to service_role;
drop policy if exists own_health_report on public.radar_health_reports;
create policy own_health_report on public.radar_health_reports for select to authenticated using ((select auth.uid())=user_id);
create index if not exists radar_health_checked_idx on public.radar_health_reports(checked_at nulls first);
create or replace function public.radar_health_candidates() returns table(user_id uuid) language plpgsql security invoker set search_path='' as $$
begin
 insert into public.radar_health_reports(user_id)
 select c.user_id from public.radar_binance_connections c
 union select p.user_id from public.radar_paper_cloud_accounts p
 on conflict do nothing;
 return query select h.user_id from public.radar_health_reports h order by h.checked_at asc nulls first limit 8;
end $$;
revoke all on function public.radar_health_candidates() from public,anon,authenticated;
grant execute on function public.radar_health_candidates() to service_role;

-- Agendamento servidor, independente do navegador. Segredo já existente no schema privado.
select cron.schedule('radar-health-every-5-minutes','*/5 * * * *',$job$
 select net.http_post(
 url := 'https://qwfsvyqyxpraulmwkfdb.supabase.co/functions/v1/radar-health-worker',
 headers := jsonb_build_object('Content-Type','application/json','X-Radar-Cron-Token',
 (select token from radar_private.paper_worker_credentials where id=true)),
 body := '{"action":"cron"}'::jsonb, timeout_milliseconds := 120000);
$job$);
