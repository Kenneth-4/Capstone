-- Insert default clusters if none exist
INSERT INTO public.clusters (name, leader, description, schedule)
SELECT 'Cluster 1', 'TBD', 'Default Cluster 1', 'Every Sunday'
WHERE NOT EXISTS (SELECT 1 FROM public.clusters LIMIT 1);

INSERT INTO public.clusters (name, leader, description, schedule)
SELECT 'Cluster 2', 'TBD', 'Default Cluster 2', 'Every Sunday'
WHERE NOT EXISTS (SELECT 1 FROM public.clusters WHERE name = 'Cluster 2');

INSERT INTO public.clusters (name, leader, description, schedule)
SELECT 'Cluster 3', 'TBD', 'Default Cluster 3', 'Every Sunday'
WHERE NOT EXISTS (SELECT 1 FROM public.clusters WHERE name = 'Cluster 3');
