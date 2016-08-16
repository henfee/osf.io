from website.util import rubeus

# TODO Determine how much of this is necessary

def options_to_hgrid(fs_options):
    permissions = {
        'view': True
    }
    for o in fs_options:
        o[rubeus.KIND] = rubeus.FOLDER
        o['permissions'] = permissions
        o['addon'] = 'figshare'
        # Currently we flatten the FS data structure when rendering in folderPicker.
        # This lets folderPicker know these items have no children to be expanded
        o['hasChildren'] = False
    return fs_options


def project_to_hgrid(node, project, user, expand=False, folders_only=False):
    if project:
        if not project.get('articles') or len(project['articles']) == 0:
            return []
        out = []
        for article in project['articles']:
            hgrid = article_to_hgrid(node, user, article, expand, folders_only)
            if hgrid:
                out.append(hgrid)
        return out
    return []


def article_to_hgrid(node, user, article, expand=False, folders_only=False):
    if node.is_public:
        if not node.is_contributor(user):
            if article.get('status') in ['Drafts', None]:
                return None

    if article['defined_type'] == 'fileset' or not article['files']:
        if folders_only:
            return None
        if expand:
            return [file_to_hgrid(node, article, item) for item in article['files']]
        return {
            'name': '{0}:{1}'.format(article['title'] or 'Unnamed', article['article_id']),  # Is often blank?
            'kind': 'folder' if article['files'] else 'folder',  # TODO Change me
            'urls': {
                'upload': '{base}figshare/{aid}/'.format(base=node.api_url, aid=article['article_id']),
                'delete': '' if article['status'] == 'public' else node.api_url + 'figshare/' + str(article['article_id']) + '/file/{id}/delete/',
                'download': '',
                # TODO: This endpoint isn't defined
                'fetch': '{base}figshare/hgrid/article/{aid}/'.format(base=node.api_url, aid=article['article_id']),
                'view': ''
            },
            'permissions': {
                'edit': article['status'] != 'Public',  # This needs to be something else
                'view': True,
                'download': article['status'] == 'Public'
            }
        }
    else:
        if folders_only:
            return None
        return file_to_hgrid(node, article, article['files'][0])


def file_to_hgrid(node, article, item):
    urls = {
        'upload': '',
        'delete': '{base}figshare/article/{aid}/file/{fid}/'.format(base=node.api_url, aid=article['article_id'], fid=item.get('id')),
        'download': item.get('download_url'),
        'view': '/{base}/figshare/article/{aid}/file/{fid}'.format(base=node._id, aid=article['article_id'], fid=item.get('id'))
    }
    permissions = {
        'edit': article['status'] != 'Public',
        'view': True,
        'download': article['status'] == 'Public'
    }

    return {
        'addon': 'figshare',
        'name': item['name'],
        rubeus.KIND: rubeus.FILE,
        'published': '',
        'tags': '',
        'description': '',
        'authors': '',
        'status': article['status'],
        'versions': '',
        'urls': urls,
        'permissions': permissions,
        'size': item.get('size'),
        'thumbnail': item.get('thumb') or '',
    }
