-- Optional patch if your database already has the old broken source links.
-- Run this in Supabase SQL Editor, or deploy this updated project and use the Run ETL button.

update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-vermeer-concert';
update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-rembrandt-storm';
update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-flinck-obelisk';
update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-rembrandt-lady-gentleman';
update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-manet-tortoni';
update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-degas-cortege';
update public.stolen_artworks set source_url = 'https://www.gardnermuseum.org/about/theft', updated_at = now() where id = 'gardner-1990-bronze-eagle';
update public.stolen_artworks set source_url = 'https://www.louvre.fr/en/explore/the-palace/from-the-mona-lisa-to-the-wedding-feast-at-cana', updated_at = now() where id = 'louvre-1911-mona-lisa';
update public.stolen_artworks set source_url = 'https://www.nasjonalmuseet.no/en/collection/object/NG.M.00939', updated_at = now() where id = 'oslo-1994-munch-scream';
update public.stolen_artworks set source_url = 'https://www.vangoghmuseum.nl/en/about/knowledge-and-research/restorations/conservation-treatment-of-view-of-the-sea-at-scheveningen', updated_at = now() where id = 'amsterdam-2002-van-gogh-scheveningen';
update public.stolen_artworks set source_url = 'https://www.vangoghmuseum.nl/en/about/knowledge-and-research/restorations/conservation-treatment-church-in-nuenen', updated_at = now() where id = 'amsterdam-2002-van-gogh-nuenen';
update public.stolen_artworks set source_url = 'https://artcrimes.fbi.gov/nsaf-view?searchText=Poppy%20Flowers', updated_at = now() where id = 'cairo-2010-van-gogh-poppy';
update public.stolen_artworks set source_url = 'https://www.fbi.gov/investigate/violent-crime/art-crime/fbi-top-ten-art-crimes', updated_at = now() where id = 'palermo-1969-caravaggio-nativity';
update public.stolen_artworks set source_url = 'https://www.fbi.gov/investigate/violent-crime/art-crime/fbi-top-ten-art-crimes', updated_at = now() where id = 'stockholm-2000-renoir-conversation';
update public.stolen_artworks set source_url = 'https://www.fbi.gov/investigate/violent-crime/art-crime/fbi-top-ten-art-crimes', updated_at = now() where id = 'stockholm-2000-rembrandt-selfportrait';
update public.stolen_artworks set source_url = 'https://www.khm.at/en/objectdb/detail/85731/', updated_at = now() where id = 'vienna-1997-saliera';
update public.stolen_artworks set source_url = 'https://www.interpol.int/Crimes/Cultural-heritage-crime/Stolen-Works-of-Art-Database', updated_at = now() where id = 'paris-2010-picasso-pigeon';
update public.stolen_artworks set source_url = 'https://www.interpol.int/Crimes/Cultural-heritage-crime/Stolen-Works-of-Art-Database', updated_at = now() where id = 'paris-2010-matisse-pastoral';
update public.stolen_artworks set source_url = 'https://www.interpol.int/Crimes/Cultural-heritage-crime/Stolen-Works-of-Art-Database', updated_at = now() where id = 'paris-2010-modigliani-fan';
update public.stolen_artworks set source_url = 'https://artobserved.com/2012/10/the-kunsthal-rotterdam-in-the-netherlands-suffered-the-loss-of-several-valuable-paintings-in-a-theft-around-300-a-m-on-october-16th-among-them-picasso-monet-gauguin-matisse-and-lucian-freud/', updated_at = now() where id = 'rotterdam-2012-picasso-harlequin';
update public.stolen_artworks set source_url = 'https://artobserved.com/2012/10/the-kunsthal-rotterdam-in-the-netherlands-suffered-the-loss-of-several-valuable-paintings-in-a-theft-around-300-a-m-on-october-16th-among-them-picasso-monet-gauguin-matisse-and-lucian-freud/', updated_at = now() where id = 'rotterdam-2012-monet-waterloo';
update public.stolen_artworks set source_url = 'https://artobserved.com/2012/10/the-kunsthal-rotterdam-in-the-netherlands-suffered-the-loss-of-several-valuable-paintings-in-a-theft-around-300-a-m-on-october-16th-among-them-picasso-monet-gauguin-matisse-and-lucian-freud/', updated_at = now() where id = 'rotterdam-2012-gauguin-woman-window';
update public.stolen_artworks set source_url = 'https://www.mnp.art.pl/en/collections/', updated_at = now() where id = 'warsaw-2000-monet-beach';
update public.stolen_artworks set source_url = 'https://abc7news.com/post/exclusive-brazen-thief-steals-dali-piece-from-san-francisco-gallery/5618908/', updated_at = now() where id = 'miami-2019-dali-elephants';
update public.stolen_artworks set source_url = 'https://www.smithsonianmag.com/smart-news/painting-found-inside-walls-italian-gallery-may-be-stolen-klimt-180973757/', updated_at = now() where id = 'milan-1997-klimt-lady';
update public.stolen_artworks set source_url = 'https://www.chch.ox.ac.uk/news/stolen-artwork-returned-christ-church-picture-gallery', updated_at = now() where id = 'oxford-2020-van-dyck-soldier';
update public.stolen_artworks set source_url = 'https://www.chch.ox.ac.uk/news/stolen-artwork-returned-christ-church-picture-gallery', updated_at = now() where id = 'oxford-2020-carracci-boy-drinking';
update public.stolen_artworks set source_url = 'https://buehrle.ch/en/artworks/the-boy-in-the-red-waistcoat/', updated_at = now() where id = 'zurich-2008-cezanne-boy-red-waistcoat';
update public.stolen_artworks set source_url = 'https://buehrle.ch/en/collection/', updated_at = now() where id = 'zurich-2008-monet-poppies';
update public.stolen_artworks set source_url = 'https://www.nationalgallery.gr/en/', updated_at = now() where id = 'athens-2012-picasso-woman-head';
update public.stolen_artworks set source_url = 'https://www.nationalgallery.gr/en/', updated_at = now() where id = 'athens-2012-mondrian-windmill';

insert into public.etl_runs (source_name, rows_loaded, run_status, details) values ('source_url_patch_v2', 31, 'success', 'Updated source URLs to more stable pages.');
